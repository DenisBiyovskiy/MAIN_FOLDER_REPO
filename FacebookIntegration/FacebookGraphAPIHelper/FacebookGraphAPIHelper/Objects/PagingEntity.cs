﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FacebookGraphAPIHelper.Objects
{
    public class PagingEntity
    {
        public string previous;
        public string next;
        public Cursors cursors;
    }
}