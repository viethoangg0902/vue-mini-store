import { notification } from 'ant-design-vue';


export const toastNotification = (type, message, description) => {
  notification[type]({
    duration: 2,
    message, description
  });
}

