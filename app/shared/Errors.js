class Errors {

  static DEFAULT = {
    icon: 'alert-circle',
    canTry: true,
  }

  static NETWORK = {
    icon: 'wifi-off',
    message: 'عدم دسترسی به اینترنت!. تنظیمات شبکه را بررسی کنید.',
    canTry: true,
  }

  static HTTP_422 = {
    message: 'اطلاعات به درستی وارد نشده است.',
    canTry: true,
  }

  static HTTP_401 = {
    message: 'عدم احراز هویت. لطفا یکبار دیگر لاگین کنید.'
  }

  static HTTP_WITH_CODE = {
    message: 'خطا در ارتباط با سرویس. کد خطا : {0}',
    canTry: true,
  }

  static SIGN_OUT_AUTO = {
    message: 'عدم احراز هویت حساب‌کاربری. سیستم به صورت خودکار از حساب کاربری شما خارج می‌شود. لطفا دوباره لاگین کنید'
  }

  static UNKNOWN = {
    message: 'خطای نامشخص'
  }

  static EMPTY_DEFAULT = {
    icon: 'assistant',
    message: 'آیتمی وجود ندارد.',
  }

  static EMPTY_USER = {
    icon: 'account-circle',
    message: 'آیتمی وجود ندارد.',
  }

}

export default Errors