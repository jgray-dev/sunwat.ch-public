import {Fragment} from 'react'
import {Menu, Transition} from '@headlessui/react'
import {ChevronDownIcon} from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ThemeSelector({theme, setTheme}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className={`inline-flex w-full justify-center gap-x-1.5 ${theme.textdark} rounded-md ${theme.bgdark} px-3 py-2 text-sm font-semibold ring-inset ring-gray-300 hover:text-white`}>
          Theme
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-200" aria-hidden="true"/>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({active}) => (
                <a className={classNames(
                  active ? 'bg-gray-100 text-gray-900 text-bold' : 'text-gray-700',
                  'block px-4 py-2 text-sm')}
                  onClick={() => setTheme("atlantic")}>
                  Atlantic
                </a>
                )}
            </Menu.Item>
            <Menu.Item>
              {({active}) => (
                <a className={classNames(
                  active ? 'bg-gray-100 text-gray-900 text-bold' : 'text-gray-700',
                  'block px-4 py-2 text-sm')}
                  onClick={() => setTheme("red")}>
                  Red
                </a>
                )}
            </Menu.Item>
            <Menu.Item>
              {({active}) => (
                <a className={classNames(
                  active ? 'bg-gray-100 text-gray-900 text-bold' : 'text-gray-700',
                  'block px-4 py-2 text-sm')}
                  onClick={() => setTheme("orange")}>
                  Orange
                </a>
                )}
            </Menu.Item>
            <Menu.Item>
              {({active}) => (
                <a className={classNames(
                  active ? 'bg-gray-100 text-gray-900 text-bold' : 'text-gray-700',
                  'block px-4 py-2 text-sm')}
                  onClick={() => setTheme("green")}>
                  Green
                </a>
                )}
            </Menu.Item>
            <Menu.Item>
              {({active}) => (
                <a className={classNames(
                  active ? 'bg-gray-100 text-gray-900 text-bold' : 'text-gray-700',
                  'block px-4 py-2 text-sm')}
                  onClick={() => setTheme("lightblue")}>
                  Light blue
                </a>
                )}
            </Menu.Item>
            <Menu.Item>
              {({active}) => (
                <a className={classNames(
                  active ? 'bg-gray-100 text-gray-900 text-bold' : 'text-gray-700',
                  'block px-4 py-2 text-sm')}
                  onClick={() => setTheme("deepblue")}>
                  Deep blue
                </a>
                )}
            </Menu.Item>
            <Menu.Item>
              {({active}) => (
                <a className={classNames(
                  active ? 'bg-gray-100 text-gray-900 text-bold' : 'text-gray-700',
                  'block px-4 py-2 text-sm')}
                  onClick={() => setTheme("purple")}>
                  Purple
                </a>
                )}
            </Menu.Item>
            <Menu.Item>
              {({active}) => (
                <a className={classNames(
                  active ? 'bg-gray-100 text-gray-900 text-bold' : 'text-gray-700',
                  'block px-4 py-2 text-sm')}
                  onClick={() => setTheme("rose")}>
                  Rose
                </a>
                )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
