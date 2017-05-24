from distutils.core import setup
from Cython.Build import cythonize

setup(
    ext_modules = cythonize(["train_word2vec_with_gensim.pyx", "thulac_tonkenize.pyx"])
)
