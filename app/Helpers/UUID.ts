export default class UUID {
    /**
     * Generate v3 UUID
     *
     * Version 3 UUIDs are named based. They require a namespace (another
     * valid UUID) and a value (the name). Given the same namespace and
     * name, the output is always the same.
     *
     * @param namespace
     * @param name
     */
    static v3(namespace: string, name: string): string | boolean {
        if (!UUID.is_valid(namespace)) return false;

        const nhex = namespace.replace(/[-{}]/g, '');

        let nstr = '';

        for (let i = 0; i < nhex.length; i += 2) {
            nstr += String.fromCharCode(parseInt(nhex.substr(i, 2), 16));
        }

        const hash = UUID.md5(nstr + name);

        return `${hash.substr(0, 8)}-${hash.substr(8, 4)}-${((parseInt(hash.substr(12, 4), 16) & 0x0fff) | 0x3000).toString(16)}-${((parseInt(hash.substr(16, 4), 16) & 0x3fff) | 0x8000).toString(16)}-${hash.substr(20, 12)}`;
    }

    /**
     *
     * Generate v4 UUID
     *
     * Version 4 UUIDs are pseudo-random.
     */
    static v4(): string {
        return `${UUID.getRandomHex(4)}-${UUID.getRandomHex(2)}-4${UUID.getRandomHex(2)}-${(parseInt(UUID.getRandomHex(2)) & 0x3fff | 0x8000).toString(16)}-${UUID.getRandomHex(6)}`;
    }

    // static v4(): string {
    //     return `${UUID.getRandomHex(4)}-${UUID.getRandomHex(2)}-4${UUID.getRandomHex(2)}-${((parseInt(UUID.getRandomHex(2), 16) & 0x3fff) | 0x8000).toString(16)}-${UUID.getRandomHex(6)}`;
    // }

    /**
     * Generate v5 UUID
     *
     * Version 5 UUIDs are named based. They require a namespace (another
     * valid UUID) and a value (the name). Given the same namespace and
     * name, the output is always the same.
     *
     * @param namespace
     * @param name
     */
    static v5(namespace: string, name: string): string | boolean {
        if (!UUID.is_valid(namespace)) return false;

        const nhex = namespace.replace(/[-{}]/g, '');

        let nstr = '';

        for (let i = 0; i < nhex.length; i += 2) {
            nstr += String.fromCharCode(parseInt(nhex.substr(i, 2), 16));
        }

        const hash = UUID.sha1(nstr + name);

        return `${hash.substr(0, 8)}-${hash.substr(8, 4)}-${((parseInt(hash.substr(12, 4), 16) & 0x0fff) | 0x5000).toString(16)}-${((parseInt(hash.substr(16, 4), 16) & 0x3fff) | 0x8000).toString(16)}-${hash.substr(20, 12)}`;
    }

    static is_valid(uuid: string): boolean {
        return /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(uuid);
    }

    private static md5(value: string): string {
        // Replace with your actual MD5 hashing logic
        return value;
    }

    private static sha1(value: string): string {
        // Replace with your actual SHA-1 hashing logic
        return value;
    }

    private static getRandomHex(length: number): string {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 16).toString(16);
        }
        return result;
    }
}
