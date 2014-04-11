/*!
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Thomas J. Otterson
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(){define(function(){var a,b,c,d,e,f,g,h;return a=1/Math.log(2),b=a*Math.log(.5),c=function(a,b,c,d){var e,f,g,h,i,j,k;for(e=f=g=h=i=0,j=c*c;d>i&&j>=g+h;)f=2*e*f+b,e=g-h+a,g=e*e,h=f*f,++i;for(k=1;4>=k;++k)f=2*e*f+b,e=g-h+a,g=e*e,h=f*f;return[i,g,h]},d=[0,0,0,255],e=[[66,30,15],[25,7,26],[9,1,47],[4,4,73],[0,7,100],[12,44,138],[24,82,177],[57,125,209],[134,181,229],[211,236,248],[241,233,191],[248,201,95],[255,170,0],[204,128,0],[153,87,0],[106,52,3]],f=[function(a,b,c,f,g){var i,j,k,l,m;return f===a?d:g?(i=192*h(a,b,c)/f,0>i&&(i=0),j=Math.floor(i)%16,k=i%1,l=e[j],m=e[(j+1)%16],[l[0]+k*(m[0]-l[0]),l[1]+k*(m[1]-l[1]),l[2]+k*(m[2]-l[2])]):(i=Math.floor(192*a/f),e[i%16])},function(a,b,c,e,f){var i,j;return e===a?d:(i=f?h(a,b,c):a,j=g(360*i/e,1,10*i/e),j.push(255),j)},function(a,b,c,e,f){var g;return e===a?d:(g=f?h(a,b,c):a,g=Math.floor(512*g/e),g>255&&(g=255),[g,g,g,255])}],g=function(a,b,c){var d,e,f,g;return c>1&&(c=1),d=c*b,e=d*(1-Math.abs(a/60%2-1)),f=c-d,g=[0,0,0],a>=0&&60>a&&(g=[d,e,0]),a>=60&&120>a&&(g=[e,d,0]),a>=120&&180>a&&(g=[0,d,e]),a>=180&&240>a&&(g=[0,e,d]),a>=240&&300>a&&(g=[e,0,d]),a>=300&&360>a&&(g=[d,0,e]),g[0]+=f,g[1]+=f,g[2]+=f,g[0]*=255,g[1]*=255,g[2]*=255,g},h=function(c,d,e){return 1+c-b-a*Math.log(Math.log(d+e))},{calculator:function(a,b,d,e){return function(g,h){var i;return i=c(g,h,b,d),f[a](i[0],i[1],i[2],d,e)}}}})}).call(this);