import tf from "@tensorflow/tfjs-node";

class L2 {
  static className = "L2";

  constructor(config) {
    return tf.regularizers.l1l2(config);
  }
}

class Lambda extends tf.layers.Layer {
  static className = "Lambda";

  constructor(config) {
    super(config);
    this.function = config.function;
  }
}

let model;

export async function loadModel() {
  tf.serialization.registerClass(L2);
  tf.serialization.registerClass(Lambda);
  model = await tf.loadLayersModel(process.env.GCLOUD_STORAGE_MODEL_URL);

  return model;
}

export async function getModel() {
  if (!model) {
    model = await loadModel();
  }
  return model;
}
