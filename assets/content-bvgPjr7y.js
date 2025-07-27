const t=`# [Guess](https://www.acmicpc.net/problem/1248)\r
\r
백준 1248 문제  \r
백트래킹 문제인데 무식하게 그냥 백트래킹으로 구현하면 20^10이라는 정신나간 숫자가 나오기에 중간에 가지치기를 잘해야 한다.  \r
다행히 -+0과 같이 가치를 칠 수 있는 조건이 주어지기에 이를 보고 조건에 맞다면 재귀를 진행하고 아니라면 뒤로 빼는 식으로 진행했다.\r
\r
\`\`\`c++\r
#include <bits/stdc++.h>\r
using namespace std;\r
\r
int N, Dp[11];\r
char S[11][11];\r
vector<int> Ans;\r
\r
bool func() {\r
	if (Ans.size() == N) {\r
		return 1;\r
	}\r
	for (int i = -10; i < 11; i++) {\r
		bool t = 1;\r
		Ans.push_back(i);\r
		for (int j = Ans.size() - 1, k = 1; j >= 0 && t; j--, k++) {\r
			Dp[k] = Dp[k - 1] + Ans[j];\r
			char s = S[j + 1][Ans.size()];\r
			t = ((s == '+' && Dp[k] > 0) || (s == '-' && Dp[k] < 0) || (s == '0' && !Dp[k]));\r
		}\r
		if (t) {\r
			if (func())\r
				return 1;\r
		}\r
		Ans.pop_back();\r
	}\r
	return 0;\r
}\r
\r
int main()\r
{\r
	ios::sync_with_stdio(false); cin.tie(0); cout.tie(0);\r
	cin >> N;\r
	for (int i = 1; i <= N; i++) {\r
		for (int j = i; j <= N; j++) {\r
			cin >> S[i][j];\r
		}\r
	}\r
	func();\r
	for (auto& a : Ans) {\r
		cout << a << ' ';\r
	}\r
}\r
\`\`\`\r
`;export{t as default};
