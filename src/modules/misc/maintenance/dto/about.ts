import { ApiProperty } from "@nestjs/swagger"

class AboutDto {
    @ApiProperty({
        description: "App version",
        example: "0.9.1",
    })
    readonly version: string

    constructor(version: string) {
        this.version = version
    }
}

export {
    AboutDto
}
