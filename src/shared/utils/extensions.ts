// const isString=(value:any):boolean=> value && typeof value === 'string';
// const isStringAndNotEmpty=(value:any):boolean=>value !=null &&  typeof value === 'string' && value.trim() !== '';
declare global {
    interface String{
        isStringAndNotEmpty():boolean 
    }
}

String.prototype.isStringAndNotEmpty = function():boolean{
    return this !=null &&  typeof this === 'string' && this.trim() !== '';
}