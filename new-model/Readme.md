维基百科中文语料的清洗
-------------------



首先是下载最新的数据，链接在这里
链接是：<http://download.wikipedia.com/zhwiki/latest/zhwiki-latest-pages-articles.xml.bz2>

### 用 Wikipedia Extractor 抽取段落

下载下来解压后是一个XML，需要整理成文章段落。这个用 Python 写的百科数据抽取器，用起来非常方便。

```sh
python WikiExtractor.py -b 6000M -o data data/zhwiki-latest-pages-articles.xml
```

### iconv 转换

为了避免编码问题，先用iconv预处理数据，消除非utf-8编码

```sh
iconv -c -t UTF-8 < data/AA/wiki_00 > data/AA/wiki.dat
```

### 简繁转换

为了避免同一个词出现简繁的不同形式，用OpenCC进行一次中文简繁转换

opencc -i data/AA/wiki.dat -o extracted/wiki.chs.dat -c t2s.json
