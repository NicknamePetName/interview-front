import ACCESS_ENUM from "@/access/accessEnum";


const checkAccess = (
    loginUser: API.LoginUserVO,
    needAcces = ACCESS_ENUM.NOT_LOGIN,
) => {
    // 获取当前用户具有的权限（如果没有登录，则默认没有权限
    const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN;
    // 如果当前不需要任何权限
    if (needAcces === ACCESS_ENUM.NOT_LOGIN) {
        return true;
    }
    // 如果当前需要登录才能访问
    if (needAcces === ACCESS_ENUM.USER) {
        // 如果用户未登录，表示无权限
        if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
            return false;
        }
    }
    // 如果需要管理员权限才能访问
    if (needAcces === ACCESS_ENUM.ADMIN) {
        // 必须要有管理员权限，如果没有，则无权限
        if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
            return false;
        }
    }
    return true;
}

export default checkAccess;