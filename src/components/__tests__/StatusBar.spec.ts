import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import StatusBar from '../StatusBar.vue';

describe('StatusBar', () => {
  it('renders properly', () => {
    const wrapper = mount(StatusBar, { props: { fps: 60.3 } });
    expect(wrapper.text()).toContain('60.3');
  });

  it('toggles play when the play button is clicked', async () => {
    const wrapper = mount(StatusBar, {
      props: {
        fps: 60,
      },
      data() {
        return {
          isPlaying: false,
        };
      },
    });

    const playButton = wrapper.get('[data-test-id="play-button"]');
    await playButton.trigger('click');
    expect((wrapper.vm as any).isPlaying).toBe(true);
    await playButton.trigger('click');
    expect((wrapper.vm as any).isPlaying).toBe(false);
  });
});
