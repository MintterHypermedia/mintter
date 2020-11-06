import {useCallback} from 'react'
import {useState} from 'react'
import {css} from 'emotion'
import Tippy from '@tippyjs/react'
import {useHistory} from 'react-router-dom'
import {Icons} from '@mintter/editor'
import {Link} from 'components/link'
import Logo from './logo_square'
import Input from './input'
import {Button} from './button'
import {isLocalhost} from 'shared/isLocalhost'

interface NavItemProps {
  href: string
  onClick: () => void
  isActive: boolean
  title: string
  className?: string
}

export default function Topbar({isPublic = false}) {
  const history = useHistory()
  const [input, setInput] = useState<string>('')
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  const isLocal = isLocalhost(window.location.hostname)
  const show = useCallback(() => setMenuVisible(true), [setMenuVisible])
  const hide = useCallback(() => setMenuVisible(false), [setMenuVisible])

  async function handleSearch(e) {
    e.preventDefault()
    await setInput('')
    history.push(`/p/${input}`)
  }

  function toggleFormMetadata() {
    if (menuVisible) {
      hide()
    } else {
      show()
    }
  }

  return isPublic ? (
    <div className="p-4 w-full border-b">
      <div
        className={`mx-16 ${css`
          max-width: 50ch;
        `}`}
      >
        <span className="text-primary flex items-center">
          <Link to="/">
            {isLocal ? (
              <Logo width="42px" className="fill-current" />
            ) : (
              <AliceLogo />
            )}
          </Link>
          {isLocal && (
            <Link to="/private">
              <span className="mx-4 px-2 text-xs">Go to Private page</span>
            </Link>
          )}
        </span>
      </div>
    </div>
  ) : (
    <div
      className={`p-4 border-b grid grid-flow-col gap-4 ${css`
        grid-template-columns: minmax(250px, 25%) 1fr minmax(250px, 25%);
      `}`}
    >
      <span className="text-primary flex items-center">
        <Link to="/private">
          <Logo width="42px" className="fill-current" />
        </Link>
        <Link to="/">
          <span className="mx-4 px-2 text-xs">Go to Public page</span>
        </Link>
      </span>
      <div>
        <div
          className={`my-0 mx-16 ${css`
            max-width: 50ch;
            width: 100%;
          `}`}
        >
          <form className="w-full" onSubmit={handleSearch}>
            <Input
              onChange={(e: any) => setInput(e.target.value)}
              name="hash-search"
              type="text"
              placeholder="Enter a publication CID"
              className="rounded-full"
            />
          </form>
        </div>
      </div>

      <div className="flex justify-end">
        <Tippy
          visible={menuVisible}
          onClickOutside={hide}
          interactive={true}
          content={
            <div
              className={`flex flex-col shadow-md ${css`
                opacity: ${menuVisible ? '1' : '0'};
              `}`}
            >
              <Button
                className="text-body"
                onClick={() => {
                  hide()
                  history.push('/private/settings')
                }}
              >
                Settings
              </Button>
            </div>
          }
        >
          <span tabIndex={0}>
            <Button onClick={toggleFormMetadata} className="flex items-center">
              <span className="mr-2 text-body">Menu</span>
              <Icons.ChevronDown
                className={`transform transition duration-200 text-body ${
                  menuVisible ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </span>
        </Tippy>
      </div>
    </div>
  )
}

function AliceLogo(props) {
  return (
    <svg width={108} height={20} viewBox="0 0 108 20" fill="none" {...props}>
      <path
        d="M5 19.1c-.92 0-1.753-.227-2.5-.68-.733-.453-1.313-1.107-1.74-1.96-.427-.867-.64-1.887-.64-3.06 0-2.027.433-3.9 1.3-5.62.867-1.733 2.147-3.12 3.84-4.16 1.693-1.053 3.727-1.58 6.1-1.58.613 0 1.267.047 1.96.14.707.093 1.347.233 1.92.42.373.107.56.373.56.8 0 .347-.133.673-.4.98-.253.307-.553.46-.9.46-.107 0-.187-.007-.24-.02a20.068 20.068 0 00-1.78-.34 9.741 9.741 0 00-1.56-.12c-1.693 0-3.133.413-4.32 1.24a7.453 7.453 0 00-2.66 3.24c-.587 1.347-.88 2.8-.88 4.36 0 1.133.22 2.013.66 2.64.453.613 1.04.92 1.76.92.813 0 1.527-.333 2.14-1 .613-.667 1.173-1.747 1.68-3.24.507-1.493 1.007-3.52 1.5-6.08.08-.373.24-.627.48-.76s.56-.2.96-.2c.947 0 1.42.307 1.42.92 0 .107-.02.24-.06.4a57.105 57.105 0 00-.96 4.3c-.28 1.56-.42 2.747-.42 3.56 0 .72.107 1.247.32 1.58.213.32.54.48.98.48.427 0 .833-.14 1.22-.42.387-.293.873-.787 1.46-1.48.16-.187.34-.28.54-.28a.44.44 0 01.4.24c.107.16.16.38.16.66 0 .52-.127.933-.38 1.24-.653.787-1.293 1.387-1.92 1.8-.627.413-1.393.62-2.3.62-.933 0-1.687-.267-2.26-.8-.573-.547-.933-1.313-1.08-2.3-.987 2.067-2.44 3.1-4.36 3.1zm18.263-4.56a.44.44 0 01.4.24c.106.16.16.38.16.66 0 .533-.127.947-.38 1.24a8.508 8.508 0 01-1.88 1.74c-.667.453-1.427.68-2.28.68-1.174 0-2.047-.533-2.62-1.6-.56-1.067-.84-2.447-.84-4.14 0-1.627.206-3.48.62-5.56.426-2.08 1.046-3.867 1.86-5.36C19.129.947 20.109.2 21.243.2c.64 0 1.14.3 1.5.9.373.587.56 1.433.56 2.54 0 1.587-.44 3.427-1.32 5.52-.88 2.093-2.074 4.167-3.58 6.22.093.547.246.94.46 1.18.213.227.493.34.84.34.546 0 1.026-.153 1.44-.46.413-.32.94-.86 1.58-1.62.16-.187.34-.28.54-.28zm-2.46-12.36c-.307 0-.654.553-1.04 1.66-.387 1.107-.727 2.48-1.02 4.12a29.808 29.808 0 00-.48 4.72c.946-1.56 1.7-3.12 2.26-4.68.56-1.573.84-3.007.84-4.3 0-1.013-.187-1.52-.56-1.52zm4.023 6.18c-.56 0-.98-.127-1.26-.38-.28-.267-.42-.633-.42-1.1 0-.467.18-.853.54-1.16.373-.32.833-.48 1.38-.48.493 0 .893.12 1.2.36.307.24.46.58.46 1.02 0 .533-.173.96-.52 1.28-.347.307-.807.46-1.38.46zm-.16 10.74c-.867 0-1.5-.307-1.9-.92-.387-.613-.58-1.427-.58-2.44 0-.6.073-1.367.22-2.3.16-.947.36-1.827.6-2.64.12-.427.28-.72.48-.88.2-.16.52-.24.96-.24.68 0 1.02.227 1.02.68 0 .333-.127 1.107-.38 2.32-.32 1.467-.48 2.46-.48 2.98 0 .4.053.707.16.92.107.213.287.32.54.32.24 0 .54-.167.9-.5.36-.333.84-.86 1.44-1.58.16-.187.34-.28.54-.28a.44.44 0 01.4.24c.107.16.16.38.16.66 0 .533-.127.947-.38 1.24-1.32 1.613-2.553 2.42-3.7 2.42zm6.282 0c-1.307 0-2.327-.367-3.06-1.1-.72-.747-1.08-1.727-1.08-2.94 0-1.08.213-2.027.64-2.84.427-.813.98-1.44 1.66-1.88.68-.44 1.393-.66 2.14-.66.733 0 1.3.22 1.7.66.413.427.62.98.62 1.66 0 .56-.127 1.033-.38 1.42-.24.387-.56.58-.96.58-.253 0-.46-.06-.62-.18a.61.61 0 01-.22-.5c0-.093.013-.2.04-.32l.06-.26c.067-.2.1-.387.1-.56 0-.173-.047-.307-.14-.4-.08-.093-.2-.14-.36-.14-.307 0-.593.14-.86.42-.267.267-.48.633-.64 1.1-.16.467-.24.98-.24 1.54 0 1.547.673 2.32 2.02 2.32.547 0 1.133-.18 1.76-.54.64-.373 1.267-.927 1.88-1.66.16-.187.34-.28.54-.28a.44.44 0 01.4.24c.107.16.16.38.16.66 0 .507-.127.92-.38 1.24a6.568 6.568 0 01-2.26 1.8c-.867.413-1.707.62-2.52.62zm10.703-3.96a.44.44 0 01.4.24c.107.16.16.38.16.66 0 .48-.113.893-.34 1.24a3.875 3.875 0 01-1.48 1.34c-.6.32-1.32.48-2.16.48-1.28 0-2.273-.38-2.98-1.14-.706-.773-1.06-1.813-1.06-3.12 0-.92.194-1.773.58-2.56.387-.8.92-1.433 1.6-1.9a4.096 4.096 0 012.34-.7c.774 0 1.394.233 1.86.7.467.453.7 1.073.7 1.86 0 .92-.333 1.713-1 2.38-.653.653-1.773 1.173-3.36 1.56.32.613.86.92 1.62.92.547 0 .994-.127 1.34-.38.36-.253.774-.68 1.24-1.28.16-.2.34-.3.54-.3zm-3.28-3.5c-.493 0-.913.287-1.26.86-.333.573-.5 1.267-.5 2.08v.04c.787-.187 1.407-.467 1.86-.84.454-.373.68-.807.68-1.3 0-.253-.073-.453-.22-.6-.133-.16-.32-.24-.56-.24zM51.1 16.423L51.92 19h.76l-2.976-9.242h-.692L46.008 19h.762l.825-2.577H51.1zm-3.294-.686l1.549-4.837 1.536 4.837h-3.085zm9.693-.603L59.523 19h.793l.006-.082-2.113-3.961c.266-.11.51-.244.73-.4.224-.157.416-.337.577-.54a2.43 2.43 0 00.375-.692c.093-.254.14-.537.14-.85 0-.432-.079-.815-.236-1.15a2.414 2.414 0 00-.628-.844 2.758 2.758 0 00-.946-.526 3.781 3.781 0 00-1.149-.197h-2.608V19h.748v-3.866h2.286zm-2.285-.654v-4.068h1.86c.308.004.596.052.863.146.27.093.503.228.698.406.199.173.353.387.463.641.114.254.172.542.172.863 0 .296-.053.567-.159.813-.102.241-.245.45-.432.628a2.159 2.159 0 01-1.447.571h-2.019zm13-4.05v-.672h-6.64v.673h2.952L64.517 19h.743v-8.57h2.952zm1.796-.672v.685h2.247v7.878h-2.247V19h5.351v-.68h-2.317v-7.877h2.317v-.685h-5.351zm13.565 6.436h-.755c-.051.318-.134.616-.248.895-.11.28-.258.523-.444.73-.182.208-.407.37-.673.49a2.29 2.29 0 01-.92.17 2 2 0 01-.807-.152 2.105 2.105 0 01-.616-.406 2.608 2.608 0 01-.444-.597 4.555 4.555 0 01-.298-.723 4.832 4.832 0 01-.165-.781 7.11 7.11 0 01-.057-.775V13.7c.004-.25.023-.506.057-.768a4.83 4.83 0 01.165-.781c.08-.254.182-.493.304-.717a2.44 2.44 0 01.445-.597c.173-.17.376-.303.61-.4.236-.102.505-.154.805-.159.352 0 .658.062.92.184.263.119.487.282.674.49.186.21.334.456.444.736.114.279.197.577.248.894h.755a4.17 4.17 0 00-.311-1.174 3 3 0 00-.61-.94 2.72 2.72 0 00-.92-.621 3.017 3.017 0 00-1.2-.216 2.77 2.77 0 00-1.796.628 3.046 3.046 0 00-.597.692c-.169.262-.309.544-.419.844-.11.3-.192.616-.247.946-.055.326-.085.65-.09.971v1.333c.005.326.035.652.09.978.055.322.137.635.247.94.11.3.248.581.413.844.17.262.37.49.603.685.233.195.497.35.793.464.3.114.635.171 1.003.171.44 0 .836-.074 1.187-.222a2.7 2.7 0 00.914-.616c.258-.262.466-.573.622-.933.161-.36.267-.747.318-1.162zm2.983 2.133v-8.57h-.761V19h5.465v-.673h-4.704zM98.32 14.57v-.666h-4.081V10.43h4.672v-.673h-5.427V19h5.459v-.673h-4.704V14.57h4.081zm7.979 2.152c0 .305-.063.567-.19.787a1.636 1.636 0 01-.501.534 2.19 2.19 0 01-.699.31 3.187 3.187 0 01-.8.102c-.325 0-.63-.042-.914-.127a2.273 2.273 0 01-.742-.393 2.065 2.065 0 01-.533-.629 2.362 2.362 0 01-.267-.882h-.768c.017.398.104.755.26 1.073.157.313.37.584.641.812.301.27.654.476 1.06.616a3.975 3.975 0 002.343.05 3.17 3.17 0 00.958-.45c.279-.199.506-.449.679-.75.174-.304.261-.66.261-1.066s-.087-.76-.261-1.06a2.454 2.454 0 00-.66-.768 4.159 4.159 0 00-.933-.546 10.939 10.939 0 00-1.016-.374 13.87 13.87 0 01-.774-.254 3.545 3.545 0 01-.736-.38 1.97 1.97 0 01-.553-.54c-.139-.212-.211-.472-.215-.781 0-.288.061-.538.184-.75.127-.21.292-.389.495-.532.203-.14.429-.244.679-.311.254-.072.51-.108.768-.108.309 0 .59.048.844.146.258.097.481.235.667.412.19.178.343.392.457.641.114.246.188.519.222.82h.774a2.612 2.612 0 00-.266-1.105 2.635 2.635 0 00-.641-.85 2.944 2.944 0 00-.94-.54 3.163 3.163 0 00-1.117-.197c-.351 0-.7.053-1.047.159a3.03 3.03 0 00-.933.45c-.275.203-.5.455-.673.756-.17.296-.254.636-.254 1.022.004.418.097.772.279 1.06.182.287.417.535.705.742.262.19.556.354.882.49.326.134.643.25.952.348.258.08.525.174.8.28.275.105.527.234.755.387.225.156.409.349.553.577.148.225.22.498.215.82z"
        fill="#DE1581"
      />
    </svg>
  )
}
