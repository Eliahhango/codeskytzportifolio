import { library } from '@fortawesome/fontawesome-svg-core'
import { faLinkedin, faTwitter, faInstagram, faWhatsapp, faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faEnvelope, faPhone, faLaptopCode, faShieldAlt, faServer,
  faChartBar, faProjectDiagram, faUsers, faComments, faMailBulk,
  faBullhorn, faCog, faPlus, faEdit, faTrash, faEye, faHome,
  faRocket, faUserTie, faStar, faCheckCircle, faDatabase,
  faRoute, faUser, faCalendar, faTag, faToggleOn, faToggleOff,
  faArrowRight, faInfoCircle, faExclamationTriangle, faSearch,
  faFilter, faDownload, faUpload, faSave, faTimes, faBars
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(
  // Brand icons
  faLinkedin, faTwitter, faInstagram, faWhatsapp, faGithub,
  // General icons
  faEnvelope, faPhone, faLaptopCode, faShieldAlt, faServer,
  // Admin panel icons
  faChartBar, faProjectDiagram, faUsers, faComments, faMailBulk,
  faBullhorn, faCog, faPlus, faEdit, faTrash, faEye, faHome,
  faRocket, faUserTie, faStar, faCheckCircle, faDatabase,
  faRoute, faUser, faCalendar, faTag, faToggleOn, faToggleOff,
  faArrowRight, faInfoCircle, faExclamationTriangle, faSearch,
  faFilter, faDownload, faUpload, faSave, faTimes, faBars
)

export { FontAwesomeIcon }
