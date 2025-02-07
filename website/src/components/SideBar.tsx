import { makeEventListener } from '@solid-primitives/event-listener';
import { isClient } from '@solid-primitives/utils';
import clsx from 'clsx';
import { createEffect, createSignal, JSX, on, Show } from 'solid-js';
import { useLocation } from 'solid-start';
import { AngleUpIcon } from '~/icons';
import { createFocusTrap } from '~/primitives';

type SideBarProps = {
  children: JSX.Element;
  buttons?: JSX.Element;
};

/**
 * Sidebar that can be extended from the bottom on smaller devices and
 * displayed on the side next to the main content on larger ones.
 */
export function SideBar(props: SideBarProps) {
  // Create open and element signal
  const [getOpen, setOpen] = createSignal(false);
  const [getElement, setElement] = createSignal<HTMLElement>();

  // Create focus trap for sidebar
  createFocusTrap(getElement, getOpen);

  // Close side bar when location pathname changes
  createEffect(
    on(
      () => useLocation().pathname,
      () => setOpen(false),
      { defer: true }
    )
  );

  // Close side bar when window width is changed to desktop
  if (isClient) {
    makeEventListener(window, 'resize', () =>
      setOpen((menuOpen) => (window.innerWidth >= 1024 ? false : menuOpen))
    );
  }

  return (
    <aside
      class={clsx(
        'sticky bottom-0 h-14 md:h-16 lg:top-[70px] lg:h-auto lg:max-h-[calc(100vh-70px)]',
        getOpen() ? 'z-30' : 'z-10'
      )}
      ref={setElement}
    >
      {/* Content */}
      <div
        class={clsx(
          'flex h-full items-center justify-end border-t-2 border-t-slate-200 backdrop-blur duration-200 dark:border-t-slate-800 lg:items-start lg:border-none',
          getOpen()
            ? 'bg-white dark:bg-gray-900'
            : 'bg-white/90 dark:bg-gray-900/90'
        )}
        id="side-bar"
      >
        {/* Buttons */}
        {props.buttons}

        {/* Toggle */}
        <button
          class="focus-ring m-1 box-content flex h-5 w-5 justify-center rounded-xl p-2.5 hover:text-slate-900 dark:hover:text-slate-200 md:h-6 md:w-6 lg:hidden"
          onClick={() => setOpen((open) => !open)}
          aria-expanded={getOpen()}
          aria-label={`${getOpen() ? 'Close' : 'Open'} side bar`}
          aria-controls="side-bar"
        >
          <AngleUpIcon
            class={clsx('h-full duration-200', getOpen() && '-rotate-180')}
          />
        </button>

        {/* Children */}
        <div
          class={clsx(
            'absolute bottom-full max-h-[60vh] w-full origin-bottom overflow-auto overscroll-contain border-t-2 border-t-slate-200 bg-white py-9 duration-200 dark:border-t-slate-800 dark:bg-gray-900 lg:static lg:max-h-full lg:w-auto lg:translate-y-0 lg:border-none lg:py-32',
            !getOpen() && 'invisible scale-y-0 lg:visible lg:scale-y-100'
          )}
        >
          {props.children}
        </div>

        {/* Gradient overlay */}
        <div
          class={clsx(
            'pointer-events-none fixed bottom-full h-14 w-full origin-bottom translate-y-0.5 bg-gradient-to-b from-transparent to-white duration-300 dark:to-gray-900 lg:hidden',
            !getOpen() && 'invisible scale-y-0'
          )}
        />
      </div>

      {/* Background overlay */}
      <div
        class={clsx(
          'absolute bottom-0 -z-10 h-screen w-full bg-black/10 dark:bg-black/20 lg:hidden',
          getOpen() ? 'duration-300' : 'invisible opacity-0 duration-75'
        )}
        onClick={() => setOpen(false)}
      />
    </aside>
  );
}
