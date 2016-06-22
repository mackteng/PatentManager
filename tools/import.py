import csv
import json
import copy
import io
import xlsx2csv
from sys import argv

#define unicode csv reader
def unicode_csv_reader(filename):
  csv_reader = csv.reader(open(filename, 'r'));
  for row in csv_reader:
    yield[unicode(cell, 'utf-8') for cell in row]

#split clientid and docketNumber
def splitClientDocket(str):
    splits = str.split('.')
    return splits[0], splits[1][:3]

#detects if title is Chinese
def isChinese(title):
    return False

table = ["clientId", "docketNumber", "clientDocketNumber", "chineseTitle", "country", "applicationDate", "applicationNumber", "publicationDate", "issueNumber", "patentTerm", "Annuity", "Status"];


#read in filename from command line
script, filename = argv
reader = unicode_csv_reader(filename);
result = io.open('result.json', 'w', encoding='utf-8');

for row in reader:
  base ={}
  for idx,val in enumerate(row):
    base[table[idx]] = val
  result.write(json.dumps(base, ensure_ascii=False, indent=4))
