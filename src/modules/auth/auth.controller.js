// src/modules/auth/auth.controller.js

import * as service from './auth.service.js'
import { success } from '../../utils/response.js'

import env from '../../config/env.js'

const cookieOptions = {
  httpOnly: true,
  secure  : env.isProd,
  sameSite: 'strict',
}

const setCookies = (res, { accessToken, refreshToken }) => {
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,              // 15 min
  })
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,    // 7 days
  })
}

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const user = await service.register({ name, email, password })
    return success(res, { statusCode: 201, message: 'Registration successful', data: { user } })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const result = await service.login({ email, password })
    setCookies(res, result)
    return success(res, {
      message: 'Login successful',
      data   : { user: result.user, isFirstLogin: result.isFirstLogin },
    })
  } catch (err) {
    next(err)
  }
}

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken
    const tokens = await service.refresh(refreshToken)
    setCookies(res, tokens)
    return success(res, { message: 'Token refreshed' })
  } catch (err) {
    next(err)
  }
}

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken
    await service.logout(refreshToken)
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    return success(res, { message: 'Logged out successfully' })
  } catch (err) {
    next(err)
  }
}

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    await service.changePassword({ userId: req.user.id, currentPassword, newPassword })
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    return success(res, { message: 'Password changed successfully. Please login again.' })
  } catch (err) {
    next(err)
  }
}

const googleCallback = async (req, res, next) => {
  try {
    const result = await service.oauthLogin(req.user)
    setCookies(res, result)
    return res.redirect(`${env.frontendUrl}/oauth/callback`)
  } catch (err) {
    next(err)
  }
}

const githubCallback = async (req, res, next) => {
  try {
    const result = await service.oauthLogin(req.user)
    setCookies(res, result)
    return res.redirect(`${env.frontendUrl}/oauth/callback`)
  } catch (err) {
    next(err)
  }
}

const me = async (req, res, next) => {
  try {
    return success(res, { message: 'User fetched', data: { user: req.user } })
  } catch (err) {
    next(err)
  }
}

export { register, login, refresh, logout, changePassword, googleCallback, githubCallback, me }