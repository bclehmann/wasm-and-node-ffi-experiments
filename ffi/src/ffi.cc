#include <napi.h>

using namespace Napi;

// A, B, n, m, p
// A is n x m, B is m x p, C (return value) is n x p
Napi::Float32Array NaiveMatrixMultiplication(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 5) {
    Napi::TypeError::New(env, "Expected 5 arguments").ThrowAsJavaScriptException();
    return Napi::Float32Array::New(env, 0);
  }

  if (!info[0].IsTypedArray() || !info[1].IsTypedArray()) {
    Napi::TypeError::New(env, "Expected TypedArray arguments").ThrowAsJavaScriptException();
    return Napi::Float32Array::New(env, 0);
  }

  Napi::TypedArray as_typed_array_a = info[0].As<Napi::TypedArray>();
  Napi::TypedArray as_typed_array_b = info[1].As<Napi::TypedArray>();

  if (as_typed_array_a.TypedArrayType() != napi_float32_array || as_typed_array_b.TypedArrayType() != napi_float32_array) {
    Napi::TypeError::New(env, "Expected Float32Array for first argument").ThrowAsJavaScriptException();
    return Napi::Float32Array::New(env, 0);
  }

  for (size_t i = 2; i < 5; i++) {
    if (!info[i].IsNumber()) {
      Napi::TypeError::New(env, "Expected number arguments for n, m, p").ThrowAsJavaScriptException();
      return Napi::Float32Array::New(env, 0);
    }
  }

  Napi::Float32Array a = as_typed_array_a.As<Napi::Float32Array>();
  Napi::Float32Array b = as_typed_array_b.As<Napi::Float32Array>();
  Napi::Number n = info[2].As<Napi::Number>();
  Napi::Number m = info[3].As<Napi::Number>();
  Napi::Number p = info[4].As<Napi::Number>();
  
  const auto n_int = n.Int32Value();
  const auto p_int = p.Int32Value();
  const auto m_int = m.Int32Value();

  if (n_int <= 0 || m_int <= 0 || p_int <= 0) {
    Napi::TypeError::New(env, "Matrix dimensions must be positive integers").ThrowAsJavaScriptException();
    return Napi::Float32Array::New(env, 0);
  }

  if (a.ElementLength() != n_int * m_int || b.ElementLength() != m_int * p_int) {
    Napi::TypeError::New(env, "Array lengths do not match matrix dimensions").ThrowAsJavaScriptException();
    return Napi::Float32Array::New(env, 0);
  }


  Napi::Float32Array c = Napi::Float32Array::New(env, m_int * p_int);


  for (size_t i = 0; i < n_int; i++) {
    for (size_t j = 0; j < p_int; j++) {
      float sum = 0.0f;
      for (size_t k = 0; k < m_int; k++) {
        sum += a[i * m_int + k] * b[k * p_int + j];
      }
      c[i * p_int + j] = sum;
    }
  }

  return c;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "naiveMatrixMultiplication"),
              Napi::Function::New(env, NaiveMatrixMultiplication));
  return exports;
}

NODE_API_MODULE(addon, Init)
