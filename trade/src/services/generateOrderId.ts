export const generateClientOrderId = () => {
    return 'ord_' + Math.random().toString(36).substring(2, 15)
}