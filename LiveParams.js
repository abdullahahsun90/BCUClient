class LiveParams {
    constructor() {
        this.params = new Array(70).fill(0);
    }

    toUInt16(byteArray, index) {
        return byteArray[index + 1] | (byteArray[index] << 8);
    }

    updateParams(byteArray) {
        let index = 0;

        if (byteArray.length >= 140) {
            for (let i = 0; i < this.params.length; i++) {
                this.params[i] = this.toUInt16(byteArray, index);
                index += 2;
            }
        }
    }
}

export default LiveParams;