# 接口文档：
## 书单：
### 获取所有书单：
`/getAllBookLists`,示例：
```json
{
    "status":200,
    "msg":"success",
    "content":[
        {
            "id":2,
            "name":"书单3"
        },
        {
            "id":3,
            "name":"书单1"
        }
    ]
}
```
### 获取书单下的所有书籍：
`/bookList/getBooksByBookList/{书单Id}`
```json
{
    "status":200,
    "msg":"success",
    "content":[
        {
            "id":7,
            "bookListId":null,
            "name":"三个火枪手",
            "author":"大仲马",
            "picPath":null,
            "desc":null
        },
        {
            "id":8,
            "bookListId":null,
            "name":"歌十八讲",
            "author":"陈黎 / 张芬龄",
            "picPath":"https://img1.doubanio.com/view/subject/m/public/s30010609.jpg",
            "desc":"简介"
        }
    ]
}
```
### 获取书籍下的所有音频信息：
`/bookAudio/getBookAudiosByBook/{书籍Id}`,实例：
```json
{
    "status":200,
    "msg":"",
    "content":[
        {
            "id":28,
            "name":"V.A. - 담다디 (드라마 `응답하라 1988`).mp3",
            "path":"C:\\Users\\xiang\\Documents\\三体\\V.A. - 담다디 (드라마 `응답하라 1988`).mp3",
            "bookId":5
        },
        {
            "id":29,
            "name":"015B - 신(新) 인류의 사랑.mp3",
            "path":"C:\\Users\\xiang\\Documents\\三体\\015B - 신(新) 인류의 사랑.mp3",
            "bookId":5
        }
    ]
}
```

