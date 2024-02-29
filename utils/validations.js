'use strict'

export const dataUser = (data) => {
    if(Object.entries(data).length  === 0 ||
    data.password) return false
    return true
}