#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Author: Pan Yang (panyangnlp@gmail.com)
# Copyright 2017 @ Yu Zhen
# changed by sunxfancy at 22 May, 2017

import gensim
import logging
import multiprocessing
import os
import re
import sys
import io
from gensim import models
from gensim.models.word2vec import logger, FAST_VERSION
logger.setLevel(logging.DEBUG)
print(FAST_VERSION)

from time import time
import thulac

thu1 = thulac.thulac(seg_only=True)  #默认模式
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s',
                    level=logging.INFO)

cleanr = re.compile('<.*?>|（）|')
def cleanhtml(raw_html):
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext


control_char_re = re.compile('\s+')

def remove_control_chars(s):
    return control_char_re.sub('', s)

class MySentences(object):
    def __init__(self, dirname):
        self.dirname = dirname

    def __iter__(self):
        for root, dirs, files in os.walk(self.dirname):
            for filename in files:
                file_path = root + '/' + filename
                if os.path.splitext(filename)[1] == '.dat':
                    print("load: "+filename)
                    with io.open(file_path, 'rt', encoding='utf-8') as f:
                        count = 0;
                        for line in f.readlines():
                            count = count + 1;
                            if line == "":
                                continue
                            rline = cleanhtml(line)
                            rline = remove_control_chars(rline).strip()
                            if rline == "":
                                continue
                            text = thu1.cut(rline, text=True)
                            if count > 10000:
                                return text.split();
                            yield text.split()


def main(data_path):
    begin = time()

    sentences = MySentences(data_path)
    model = gensim.models.Word2Vec(sentences,
                                   size=200,
                                   window=10,
                                   min_count=10,
                                   workers=1)
    model.save("data/model/word2vec_gensim")
    model.wv.save_word2vec_format("data/model/word2vec_orginal",
                                  "data/model/vocabulary",
                                  binary=False)

    end = time()
    print("Total procesing time: %d seconds" % (end - begin))


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Please use python train_with_gensim.py data_path")
        exit()
    data_path = sys.argv[1]
