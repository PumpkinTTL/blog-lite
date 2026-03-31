import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from './App.vue'

// 主题初始化
import { initTheme } from '@/utils/theme'

// 样式导入
import '@/style.css'
import '@/styles/index.scss'
import 'animate.css'
// Font Awesome 图标
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faGithub,
  faTwitter,
  faDiscord
} from '@fortawesome/free-brands-svg-icons'
import {
  faUser,
  faLock,
  faHome,
  faCog,
  faPlus,
  faMinus,
  faRefresh,
  faSearch,
  faEdit,
  faTrash,
  faSave,
  faCheck,
  faTimes,
  faEye,
  faEyeSlash,
  faDownload,
  faUpload,
  faArrowLeft,
  faArrowRight,
  faBell,
  faBars,
  faXmark,
  faMagnifyingGlass,
  faStar,
  faUsers,
  faBook,
  faChartLine,
  faDollarSign,
  faCompass,
  faTags,
  faCircleInfo,
  faMoon,
  faSun,
  faChevronDown,
  faCrown,
  faClock,
  faComment,
  faCalendarDays,
  faBookOpen,
  faShareNodes,
  faNewspaper,
  faListCheck,
  faListUl,
  faBolt,
  faPenNib,
  faLayerGroup,
  faHeart,
  faFire,
  faShieldHalved,
  faCircleCheck,
  faGem,
  faRobot,
  faCode,
  faServer,
  faPalette,
  faBrain,
  faWrench,
  faEllipsis,
  faChevronLeft,
  faChevronRight,
  faBullhorn,
  faTriangleExclamation,
  faArrowUp,
  faRss,
  faPaperPlane,
  faEnvelope,
  faFileLines,
  faThumbsUp,
  faAt,
  faBookmark,
  faShoppingCart,
  faShoppingBag,
  faFilter,
  faSort,
  faFireFlameCurved,
  faCircleXmark,
  faShop,
  faUsersRectangle
} from '@fortawesome/free-solid-svg-icons'

// 添加图标到库
library.add(
  faGithub, faTwitter, faDiscord,
  faUser, faLock, faHome, faCog, faPlus, faMinus, faRefresh,
  faSearch, faEdit, faTrash, faSave, faCheck, faTimes,
  faEye, faEyeSlash, faDownload, faUpload, faArrowLeft, faArrowRight,
  faBell, faBars, faXmark, faMagnifyingGlass, faStar, faUsers,
  faBook, faChartLine, faDollarSign, faCompass, faTags, faCircleInfo,
  faMoon, faSun, faChevronDown, faCrown, faClock, faComment,
  faCalendarDays, faBookOpen, faShareNodes, faNewspaper, faListCheck, faListUl,
  faBolt, faPenNib, faLayerGroup, faHeart, faFire,
  faShieldHalved, faCrown, faCircleCheck, faGem, faRobot,
  faCode, faServer, faPalette, faBrain, faWrench,
  faEllipsis, faChevronLeft, faChevronRight,
  faBullhorn, faTriangleExclamation, faArrowUp, faRss, faPaperPlane, faEnvelope,
  faFileLines, faThumbsUp, faAt, faBookmark,
  faShoppingCart, faShoppingBag, faFilter, faSort, faFireFlameCurved, faFire, faMagnifyingGlass, faDownload, faEye, faCircleXmark, faShop, faUsersRectangle
)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

// 初始化主题
initTheme()

app.mount('#app')
