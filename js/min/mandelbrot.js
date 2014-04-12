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
(function(){define(function(){var a,b,c,d,e,f,g,h;return a=1/Math.log(2),b=a*Math.log(.5),c=function(a,b,c,d){var e,f,g,h,i,j,k;for(e=f=g=h=i=0,j=c*c;d>i&&j>=g+h;)f=2*e*f+b,e=g-h+a,g=e*e,h=f*f,++i;for(k=1;4>=k;++k)f=2*e*f+b,e=g-h+a,g=e*e,h=f*f;return[i,g,h]},d=[0,0,0,255],e=[[9,1,47],[4,4,73],[0,7,100],[12,44,138],[24,82,177],[57,125,209],[134,181,229],[211,236,248],[241,233,191],[248,201,95],[255,170,0],[204,128,0],[153,87,0],[106,52,3],[66,30,15],[25,7,26]],f=[function(a,b,c,f,g,i,j){var k,l,m,n,o;return f===a?d:j?(k=16*g*h(a,b,c)/f,0>k&&(k=0),l=(Math.floor(k)+i)%16,m=k%1,n=e[l],o=e[(l+1)%16],[n[0]+m*(o[0]-n[0]),n[1]+m*(o[1]-n[1]),n[2]+m*(o[2]-n[2])]):(k=Math.floor(16*g*a/f),e[(k+i)%16])},function(a,b,c,e,f,i,j){var k,l;return e===a?d:(k=j?h(a,b,c):a,l=g(360*k/e,1,10*k/e),l.push(255),l)},function(a,b,c,e,f,g,i){var j;return e===a?d:(j=i?h(a,b,c):a,j=Math.floor(512*j/e),j>255&&(j=255),[j,j,j,255])}],g=function(a,b,c){var d,e,f,g;return c>1&&(c=1),d=c*b,e=d*(1-Math.abs(a/60%2-1)),f=c-d,g=[0,0,0],a>=0&&60>a&&(g=[d,e,0]),a>=60&&120>a&&(g=[e,d,0]),a>=120&&180>a&&(g=[0,d,e]),a>=180&&240>a&&(g=[0,e,d]),a>=240&&300>a&&(g=[e,0,d]),a>=300&&360>a&&(g=[d,0,e]),g[0]+=f,g[1]+=f,g[2]+=f,g[0]*=255,g[1]*=255,g[2]*=255,g},h=function(c,d,e){return 1+c-b-a*Math.log(Math.log(d+e))},{calculator:function(a,b,d,e,g,h){return function(i,j){var k;return k=c(i,j,b,d),f[a](k[0],k[1],k[2],d,e,g,h)}}}})}).call(this);