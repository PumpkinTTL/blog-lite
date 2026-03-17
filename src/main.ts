import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from './App.vue'

// 样式导入
import '@/style.css'
import '@/styles/index.scss'
import 'animate.css'
// Font Awesome 图标
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
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
  faBolt,
  faPenNib,
  faLayerGroup,
  faHeart
} from '@fortawesome/free-solid-svg-icons'

// 添加图标到库
library.add(
  faUser, faLock, faHome, faCog, faPlus, faMinus, faRefresh,
  faSearch, faEdit, faTrash, faSave, faCheck, faTimes,
  faEye, faEyeSlash, faDownload, faUpload, faArrowLeft, faArrowRight,
  faBell, faBars, faXmark, faMagnifyingGlass, faStar, faUsers,
  faBook, faChartLine, faDollarSign, faCompass, faTags, faCircleInfo,
  faMoon, faSun, faChevronDown, faCrown, faClock, faComment,
  faCalendarDays, faBookOpen, faShareNodes, faNewspaper, faListCheck,
  faBolt, faPenNib, faLayerGroup, faHeart
)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
