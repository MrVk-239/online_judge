#include <iostream>
#include <algorithm> // required for reverse
using namespace std;

int main() {
  string str;
  cin >> str;
  reverse(str.begin(), str.end());
  cout << str;
  return 0;
}
