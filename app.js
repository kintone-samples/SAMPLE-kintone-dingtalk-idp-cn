const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const metadataRouter = require('./routes/metadata')
const ssoRouter = require('./routes/saml/sso')
const signoutRouter = require('./routes/signout')
const signinRouter = require('./routes/signin')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/metadata', metadataRouter)
app.use('/saml/sso', ssoRouter)
app.use('/signout', signoutRouter)
app.use('/signin', signinRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)))

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
