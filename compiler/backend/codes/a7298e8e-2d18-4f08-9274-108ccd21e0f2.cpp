#include <iostream>
#include <algorithm> // for std::reverse
using namespace std;

int main() {
string str;
cin>>str;
    reverse(str.begin(), str.end());
    cout << str << endl;
    return 0;
}