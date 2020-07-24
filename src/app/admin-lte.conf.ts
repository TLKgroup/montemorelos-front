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
            label: ' Reportes', 
            route: '/reportes', 
            iconClasses: 'fa fa-file-text-o', 
            pullRights: [
                { 
                    classes: 'label pull-right bg-green' 
                }
            ] 
        },
        { 
            label: ' Turismo', 
            route: '/turismo', 
            iconClasses: 'fa fa-map', 
            pullRights: [
                { 
                    classes: 'label pull-right bg-red' 
                }
            ] 
        }
    ]
};