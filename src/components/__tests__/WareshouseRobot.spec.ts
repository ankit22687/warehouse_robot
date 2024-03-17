import { describe, it, expect } from 'vitest';
import WarehouseRobot from '../WarehouseRobot.vue';
import { mount } from '@vue/test-utils';

describe('WarehouseRobot', () => {

    const wrapper = mount(WarehouseRobot);

    it('should render conrrectly', () => {
        expect(wrapper.html()).toMatchSnapshot();
    })

    it('should validate command', async () => {
        const form = wrapper.find('form');
        const input = wrapper.find('form').find('input[type="text"]');

        input.setValue('');
        await form.trigger('submit');

        expect(wrapper.find('.error').exists()).toBe(true);
        expect(wrapper.find('.error').text()).toContain('Command is required.');
    });

    it('should move the robot to original position', async () => {

        expect(wrapper.find('.bg-blue-500').exists()).toBe(true);

        const form = wrapper.find('form');
        const input = wrapper.find('form').find('input[type="text"]');

        input.setValue('N E S W');
        await form.trigger('submit');

        expect(wrapper.find('.bg-blue-500[data-x="0"][data-y="9"]').html()).toContain('<i class="fa-solid fa-robot"></i>');
    });

    it('should move the robot to middle of grid', async () => {

        expect(wrapper.find('.bg-blue-500').exists()).toBe(true);

        const form = wrapper.find('form');
        const input = wrapper.find('form').find('input[type="text"]');

        input.setValue('N E N E N E N E');
        await form.trigger('submit');

        expect(wrapper.find('.bg-blue-500[data-x="4"][data-y="5"]').html()).toContain('<i class="fa-solid fa-robot"></i>');
    });
});