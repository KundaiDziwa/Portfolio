function toggleMenu() {
    var menuList = document.getElementById("menuList");
    if (menuList.style.maxHeight == '0rem') {
        menuList.style.maxHeight = '11.25rem';
    } else {
        menuList.style.maxHeight = '0rem';
    }
}