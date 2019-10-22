export class User{
    constructor(
        public id_usuario: string,
        public nombre_empleado: string,
        public nombre_usuario: string,
        public contrasena: string,
        public id_role: string,
        public token?: string,
        public status?: string,
        public fecha_creacion?: string,
        public creado_por?: string,
        public fecha_ultima_modificacion?: string,
        public fecha_modificacion_por?: string,
        public nombre_role?: string
    ){}
}
