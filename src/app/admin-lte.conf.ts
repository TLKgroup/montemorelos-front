export const adminLteConf = {
    sidebarLeftMenu: [
        {
            label: 'Menu de Navegacion',
            separator: true
        },
        {
            label: ' Inicio', route: '/',
            iconClasses: 'fa fa-road', 
            pullRights: [
                { 
                    classes: 'label pull-right bg-green' 
                }
            ]
        },
        { 
            label: 'Perfil', route: '/perfil', 
            iconClasses: 'fa fa-user', 
            pullRights: [
                { 
                    classes: 'label pull-right bg-green' 
                }
            ] 
        },
        { 
            label: ' Clientes', route: '/clientes', 
            iconClasses: 'fa fa-address-card', 
            pullRights: [
                { 
                    classes: 'label pull-right bg-green' 
                }
            ] 
        },
        { 
            label: ' Proveedores', 
            route: '/proveedores', 
            iconClasses: 'fa fa-users', 
            pullRights: [
                { 
                    classes: 'label pull-right bg-green' 
                }
            ] 
        },
        { 
            label: ' Productos', 
            route: '/productos', 
            iconClasses: 'fa fa-product-hunt', 
            pullRights: [
                { 
                    classes: 'label pull-right bg-green' 
                }
            ] 
        },
        { 
            label: ' Usuarios', 
            route: '/usuarios', 
            iconClasses: 'fa fa-user-o', 
            pullRights: [
                { 
                    classes: 'label pull-right bg-green' 
                }
            ] 
        },
        { 
            label: ' Entradas', 
            route: '/entradas', 
            iconClasses: 'fa fa-users', 
            pullRights: [
                { 
                    classes: 'label pull-right bg-green' 
                }
            ] 
        },
    ]
};