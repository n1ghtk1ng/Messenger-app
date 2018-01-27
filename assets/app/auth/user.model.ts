/**
 * Created by Aman on 1/2/2018.
 */

export class User{

    constructor(public email: string,
                public password: string,
                public firstName?: string,    // ?= means optional
                public lastName?: string){}
}