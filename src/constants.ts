export const CPP_STYLES = [
  "LLVM",
  "Google",
  "Chromium",
  "Mozilla",
  "WebKit",
  "Microsoft",
  "GNU",
] as const

export type ClangStyle = typeof CPP_STYLES[number]

export const TEMPLATES = {
  "Empty": "",
  "Hello World": `#include <iostream>
int main() {
std::cout << "Hello, World!" << std::endl;
for(int i=0;i<10;i++){std::cout<<i<<" ";}
return 0;
}`,

  "Classes & Objects": `#include <string>
class Person{
private:
std::string name;int age;
public:
Person(std::string n,int a):name(n),age(a){}
void display(){
// This is a display method
}
};`,

  "Templates & Lambdas": `template <typename T>
T add(T a, T b) { return a + b; }
int main() {
auto sum = [](int x, int y) -> int {
return x + y;
};
return sum(5, 10);
}`,

  "Switch & Enums": `enum Color { RED, GREEN, BLUE };
void checkColor(Color c) {
switch(c) {
case RED:
handleRed(); break;
case GREEN: {
handleGreen();
break;
}
default: break;
}
}`,
  "Complex Loop": `void matrixMul(int A[2][2], int B[2][2], int C[2][2]) {
for (int i = 0; i < 2; i++) {
for (int j = 0; j < 2; j++) {
C[i][j] = 0;
for (int k = 0; k < 2; k++) {
C[i][j] += A[i][k] * B[k][j];
}
}
}
}`,
  "Modern Features": `template <typename T>
class Processor {
public:
auto process(T input) -> decltype(input + input) {
auto lambda = [this, input](auto scale) -> auto {
if constexpr (sizeof(T) > 4) { return input * scale; }
else { return input + scale; }
};
return lambda(2);
}
};
int main() {
Processor<int> p;
auto result = p.process(10);
return 0;
}`,
}

export type TemplateName = keyof typeof TEMPLATES
export const TEMPLATE_NAMES = Object.keys(TEMPLATES) as TemplateName[]
