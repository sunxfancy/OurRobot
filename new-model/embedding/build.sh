TF_INC=$(python3 -c 'import tensorflow as tf; print(tf.sysconfig.get_include())')
echo $TF_INC
g++ -std=c++11 -undefined dynamic_lookup -shared word2vec_ops.cc word2vec_kernels.cc -o word2vec_ops.so -fPIC -I $TF_INC -O2 -D_GLIBCXX_USE_CXX11_ABI=0
