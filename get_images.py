# -*- coding: utf-8 -*-

# This file is part of PyBOSSA.
#
# PyBOSSA is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# PyBOSSA is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with PyBOSSA.  If not, see <http://www.gnu.org/licenses/>.

import os
import string


def get_antimatter_pictures(folder, url):
    """
    Gets public photos from a folder
    """
    tasks = dict()
    photos = []
    for f in os.listdir(folder):
        if f.endswith(".jpg"):
            image, viewid, zoom = f.split("_")
            if tasks.get(viewid) is None:
                _url = "%s/image_%s_ifr" % (url, viewid)
                tasks[viewid] = _url
    for k in tasks.keys():
        photo = dict(viewid=k, url=tasks[k])
        photos.append(photo)
    return photos
