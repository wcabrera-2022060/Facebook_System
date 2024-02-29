'use strict'

import { initServer } from './configs/app.js'
import { connect } from './configs/db.js'

initServer()
connect()