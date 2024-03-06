import { createStore } from 'vuex'

import reviewModule from './reviewModule'
import utilsModule from './utilsModule'
import usersModule from './userModule'

export default createStore({
	modules: {
		reviews: reviewModule,
		utils: utilsModule,
		users: usersModule,
	},
})