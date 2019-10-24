export class Report{
    constructor(
        public id_report: string,
        public uidUser: string,
        public type: string,
        public description: string,
        public colony: string,
        public latitude: string,
        public longitude: string,
        public urlImage1?: string,
        public urlImage2?: string,
        public urlImage3?: string,
        public urlVideo?: string,     
        public status?: string,     
    ){}
}