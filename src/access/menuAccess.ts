import {menus} from "../../config/menu";
import checkAccess from "@/access/checkAccess";

/**
 * 根据权限获取可访问菜单（递归）
 * @param loginUser
 * @param menuItems
 */
const getAccessibleMenus = (loginUser: API.LoginUserVO, menuItems = menus) => {
    return menuItems.filter((item) => {
        if (!checkAccess(loginUser, item.access)) {
            return false;
        }
        if (item.children) {
            item.children = getAccessibleMenus(loginUser, item.children);
        }
        return true;
    });
};

export default getAccessibleMenus;