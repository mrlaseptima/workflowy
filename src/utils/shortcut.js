class Shortcut {
  key(code) {
    switch (code) {
      case 13:
        return "ENTER";

      case 9:
        return "TAB";

      case 8:
        return "BACKSPACE";

      case 46:
        return "DELETE";

      default:
        break;
    }
  }
}

const shortcut = new Shortcut();
export default shortcut;
