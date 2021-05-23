## 双击两次返回退出
```java
@Override
    public void onBackPressed() {
        WebView webView = findViewById(R.id.webview);
        String url = webView.getUrl();
        if (url.contains("Picture") || url.contains("Video") || url.contains("Entry")) {
            super.onBackPressed();
        } else {
            long mNowTime = System.currentTimeMillis();//获取第一次按键时间
            if ((mNowTime - mPressedTime) > 2000) {//比较两次按键时间差
                Toast.makeText(this, "再按一次退出程序", Toast.LENGTH_SHORT).show();
                mPressedTime = mNowTime;
            } else {//退出程序
                this.finish();
                System.exit(0);
            }
        }
    }
```

## 启用http

```xml
android:usesCleartextTraffic="true"
```
