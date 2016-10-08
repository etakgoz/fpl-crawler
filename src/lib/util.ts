export default class Util {
    public static titleCase (str: string): string {
        return str.split(' ').map(word => {
            if (word.toUpperCase() === word) {
                word = word.toLowerCase();
            }

            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');

    }
}
