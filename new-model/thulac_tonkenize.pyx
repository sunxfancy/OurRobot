#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import multiprocessing
import os
import re
import sys
import io
import thulac

thu1 = thulac.thulac(seg_only=True)  #默认模式

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
                        for line in f.readlines():
                            if line == "":
                                continue
                            rline = cleanhtml(line)
                            rline = remove_control_chars(rline).strip()
                            if rline == "":
                                continue
                            yield thu1.cut(rline, text=True)


def main(dir, output):
    with io.open(output, 'wt', encoding='utf-8') as f:
        for i in MySentences(dir):
            f.write(i+'\n')
