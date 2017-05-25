
import sys
import tensorflow as tf
from word2vec_optimized import Options, Word2Vec


flags = tf.app.flags
flags.FLAGS.save_path = "../data/model-tf/"
flags.FLAGS.train_data = "../data/wiki.chs.tk"
opts = Options()
with tf.Graph().as_default(), tf.Session() as s:
    model = Word2Vec(opts, s)
    ckpt = tf.train.get_checkpoint_state(flags.FLAGS.save_path)
    print(ckpt.model_checkpoint_path)
    if ckpt and ckpt.model_checkpoint_path:
        model.saver.restore(session, ckpt.model_checkpoint_path)

    print('finsh model loading')
    while True:
        print('input your word')
        word = sys.stdin.readline().strip().encode('utf-8')
        print('answers:')
        print(model.nearby([word]))
