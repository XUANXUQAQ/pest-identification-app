const networkUtils = {
  args: {
    form(args) {
      const formData = new FormData();
      const keys = Object.keys(args);
      keys.forEach((key) => {
        formData.append(key, args[key]);
      });
      return formData;
    },
  },
};

export default networkUtils;
