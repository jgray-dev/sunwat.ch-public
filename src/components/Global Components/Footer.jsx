import {HeartIcon} from '@heroicons/react/24/outline'
import {FaLinkedin} from "react-icons/fa6";
import {FaGithubSquare} from "react-icons/fa";
import {FaInstagramSquare} from "react-icons/fa";
import {useNavigate} from "react-router-dom";


//Icons + href links for social media's
const navigation = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/jackson-gray-b942b9248/',
    icon: (props) => (
      <svg fill="currentColor"  {...props}>
        <FaLinkedin className="h-12 w-12"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/j4ckson.g/',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <FaInstagramSquare/>
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com/jgray-dev',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <FaGithubSquare/>
      </svg>
    ),
  }
]

function Footer({theme, authed}) {
  const navigate = useNavigate();

  return (
    <footer className={`${theme.bg}`}>
      <div
        className={`mx-auto max-w-7xl px-6 py-2 md:flex md:items-center md:justify-between lg:px-8 ${theme.textdark}`}>
        <div className="flex justify-center space-x-6 md:order-2">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className={`${theme.text} hover:${theme.texthover}}`}>
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true"/>
            </a>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-2 md:text-left text-center">
          <div className="flex mb-2 justify-center md:justify-start">
            Made with&nbsp;
            <HeartIcon className="h-4 w-4 stroke-red-800 fill-red-900"/>
            &nbsp;in&nbsp;
            <p onClick={() => {
              if (authed) {
                navigate("/details")
              }
            }}>Denver</p>
          </div>
          <div className="text-center md:text-left">
            Data provided by
            <a href="https://www.accuweather.com/" target="\\\\\\\_blank"> Accuweather</a>,
            <a href="https://sunrisesunset.io/api/" target="\\\\\\\_blank"> SunriseSunset</a>,
            <a href="https://www.ipify.org/" target="\\\\\\\_blank"> ipify</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer
