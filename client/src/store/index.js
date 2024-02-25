import { createStore } from 'vuex'

import reviewModule from './reviewModule'
import utilsModule from './utilsModule'

export default createStore({
	modules: {
		reviews: reviewModule,
		utils: utilsModule,
	},
})