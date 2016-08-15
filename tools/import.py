import csv
import json
import copy
import io
import xlsx2csv
from sys import argv
from datetime import datetime
import requests

#define unicode csv reader
def unicode_csv_reader(filename):
  csv_reader = csv.reader(open(filename, 'r'));
  next(csv_reader)
  for row in csv_reader:
    yield[unicode(cell, 'utf-8') for cell in row]

#split clientid and docketNumber
def splitClientDocket(str):
    splits = str.split('.')
    return [splits[0], int(splits[1][:3])]

def splitCountryType(str):
    splits = str.split('-')
    return [splits[0],'REG'] if len(splits) == 1 else [splits[0],splits[1]]

#detects if title is Chinese
def isChinese(title):
    return False

table = ["clientId", "docketNumber", "clientDocketNumber", "chineseTitle", "country", "applicationType", "filingDate", "filingNumber", "publicationDate", "issueNumber", "patentExpirationDate", "Comment"];


#read in filename from command line
script, filename = argv
reader = unicode_csv_reader(filename);

for row in reader:
  base ={}
  if len(row[0]) == 0:
      break
  row = row[:3] + splitCountryType(row[3]) + row[4:]
  #split clientID and Docket Number
  row = splitClientDocket(row[0]) + row[1:]
  #check if country contains applicationType

  base['patentType'] = 'Patent'
  base['status'] = 'Active'
  for idx,val in enumerate(row):
    base[table[idx]] = val
  try:
      base['filingDate'] = datetime.strptime(base['filingDate'], '%m-%d-%y').isoformat()
  except:
      base['filingDate'] = datetime.strptime(base['filingDate'], '%Y/%m/%d').isoformat()
  #result.write(json.dumps(base, ensure_ascii=False, indent=4))
  jsonData =  json.dumps(base, ensure_ascii=False, indent=4)
  print jsonData
  requests.post('http://192.168.19.158/api/patents',data=base)
